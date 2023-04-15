/* eslint-disable no-unused-vars */
import pool from '../config/pg';
import fs from 'fs';
import {
  PoolClient, QueryResult,
} from 'pg';
import i18n from 'i18next';

const runMigration = async (
  migrationId: string,
  migration: (client: PoolClient) => void,
  client: PoolClient,
) => {
  try {
    await migration(client);

    console.log(i18n.t('MIGRATION.RUNNED_SUCCESSFULLY', { migrationId }));
  } catch (error: unknown) {
    console.log(i18n.t('MIGRATION.FAILED_RUNNING', { migrationId }));
    await client.query('ROLLBACK');
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

export default async () => {
  const client: PoolClient = await pool.connect();

  try {
    await client.query('BEGIN');
    console.log(i18n.t('MIGRATION.STARTING_MIGRATIONS'));
    const files: Array<string> = fs.readdirSync('./src/migrations/queries');
    files.sort();

    files.forEach(async (file: string) => {
      const file_id: string = file.substring(0, 15);
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const migration: (client: PoolClient) => void = require('./queries/'+file);
      const { mtime } = fs.statSync('./src/migrations/queries/' + file);

      const dbMigration: void | QueryResult<{
          migration_id: string, last_modified: Date
        }> = await client.query(
          'Select * from migrations where migration_id = $1',
          [file_id],
        ).catch(async (error: unknown) => {
          console.log(i18n.t('MIGRATION.FAILED_FETCHING', { migrationId: file_id }));
          await client.query('ROLLBACK');
          if (error instanceof Error) {
            throw new Error(error.message);
          }
        });

      if (!dbMigration) {
        return;
      }

      if (dbMigration.rows.length === 0) {
        await runMigration(file_id, migration, client);

        try {
          await client.query(
            'Insert into migrations(migration_id, last_modified) values ($1,$2)',
            [ file_id, mtime ],
          );
        } catch (error: unknown) {
          console.log(i18n.t('MIGRATION.FAILED_INSERTING', { migrationId: file_id }));
          await client.query('ROLLBACK');
          if (error instanceof Error) {
            throw new Error(error.message);
          }
        }
      } else {
        if (dbMigration.rows[0].last_modified.getTime() !== mtime.getTime()) {
          await runMigration(file_id, migration, client);

          try {
            await client.query(
              'UPDATE migrations SET last_modified = $1 WHERE migration_id = $2',
              [ mtime, file_id ],
            );
          } catch (error: unknown) {
            console.log(i18n.t('MIGRATION.FAILED_UPDATING', { migrationId: file_id }));
            await client.query('ROLLBACK');
            if (error instanceof Error) {
              throw new Error(error.message);
            }
          }
        }
      }
    });
    await client.query('COMMIT');

    await client.query('BEGIN');

    let migrationsToCheck;
    try {
      migrationsToCheck = await client.query('SELECT migration_id FROM migrations');

      if (migrationsToCheck.rows.length > 0) {
        migrationsToCheck.rows.forEach(async (migration) => {
          const file = files.find((file) => file.substring(0, 15) === migration.migration_id);

          if (!file) {
            try {
              await client.query(
                'DELETE FROM migrations WHERE migration_id = $1',
                [migration.migration_id],
              );

              console.log(i18n.t('MIGRATION.REMOVED_SUCCESSFULLY', { migrationId: migration.migration_id }));
            } catch (error: unknown) {
              console.log(i18n.t('MIGRATION.FAILED_REMOVING', { migrationId: migration.migration_id }));
              await client.query('ROLLBACK');
              if (error instanceof Error) {
                throw new Error(error.message);
              }
            }
          }
        });
      }
    } catch (error: unknown) {
      console.log(i18n.t('MIGRATION.FAILED_ACCESSING_DB'));
      await client.query('ROLLBACK');
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  } catch (error: unknown) {
    await client.query('ROLLBACK');
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  } finally {
    await client.query('COMMIT');
    console.log(i18n.t('MIGRATION.FINISHING_MIGRATIONS'));
    client.release();
  }
};