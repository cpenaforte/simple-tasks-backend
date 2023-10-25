/* eslint-disable no-unused-vars */
import pool from '../config/pg';
import fs from 'fs';
import {
    PoolClient,
} from 'pg';
import i18n from 'i18next';

const runMigration = async (
    migrationId: string,
    migration: (client: PoolClient) => Promise<void>,
    client: PoolClient,
) => {
    try {
        await migration(client);

        console.log(i18n.t('MIGRATION.RUNNED_SUCCESSFULLY', { migrationId }));
    } catch (error: unknown) {
        console.log(i18n.t('MIGRATION.FAILED_RUNNING', { migrationId }));
        await client.query('ROLLBACK');

        process.abort();
    }
};
const migrate = async () => {
    const client: PoolClient = await pool.connect();

    try {
        console.log(i18n.t('MIGRATION.STARTING_MIGRATIONS'));
        await client.query('BEGIN');

        await client.query('CREATE TABLE IF NOT EXISTS migrations (migration_id varchar(20) primary key, last_modified timestamp not null)');

        await client.query('COMMIT');

        const files: Array<string> = fs.readdirSync(__dirname + '/queries');
        files.sort();

        await client.query('BEGIN');

        const migrationsResult = await client.query('SELECT * FROM migrations');

        await client.query('COMMIT');

        const dbMigrations = migrationsResult.rows;

        files.forEach(async (file: string) => {
            const file_id: string = file.substring(0, 15);
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const migration: (client: PoolClient) => Promise<void> = require('./queries/' + file);
            const { mtime } = fs.statSync(__dirname + '/queries/' + file);

            const dbMigration = dbMigrations.find((migration) => migration.migration_id === file_id);

            if (!dbMigration) {
                await client.query('BEGIN');

                await runMigration(file_id, migration, client);

                await client.query('COMMIT');

                try {
                    await client.query('BEGIN');

                    await client.query(
                        'Insert into migrations(migration_id, last_modified) values ($1,$2)',
                        [ file_id, mtime ],
                    );

                    await client.query('COMMIT');
                } catch (error: unknown) {
                    console.log(i18n.t('MIGRATION.FAILED_INSERTING', { migrationId: file_id }));
                    await client.query('ROLLBACK');
                    if (error instanceof Error) {
                        throw new Error(error.message);
                    }
                }
            } else if (dbMigration?.last_modified && dbMigration.last_modified.getTime() !== mtime.getTime()) {
                await client.query('BEGIN');

                await runMigration(file_id, migration, client);

                await client.query('COMMIT');

                try {
                    await client.query('BEGIN');

                    await client.query(
                        'UPDATE migrations SET last_modified = $1 WHERE migration_id = $2',
                        [ mtime, file_id ],
                    );

                    await client.query('COMMIT');
                } catch (error: unknown) {
                    console.log(i18n.t('MIGRATION.FAILED_UPDATING', { migrationId: file_id }));
                    await client.query('ROLLBACK');
                    if (error instanceof Error) {
                        throw new Error(error.message);
                    }
                }
            }
        });

        try {
            await client.query('BEGIN');

            const migrationsToCheck = await client.query('SELECT migration_id FROM migrations');

            await client.query('COMMIT');

            if (migrationsToCheck.rows.length > 0) {
                migrationsToCheck.rows.forEach(async (migration) => {
                    const file = files.find((file) => file.substring(0, 15) === migration.migration_id);

                    if (!file) {
                        try {
                            await client.query('BEGIN');

                            await client.query(
                                'DELETE FROM migrations WHERE migration_id = $1',
                                [migration.migration_id],
                            );

                            await client.query('COMMIT');

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
        console.log(i18n.t('MIGRATION.FINISHING_MIGRATIONS'));
        client.release();
    }
};

export default migrate;