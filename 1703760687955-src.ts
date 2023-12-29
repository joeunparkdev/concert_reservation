import { hash } from "bcrypt";
import { MigrationInterface, QueryRunner } from "typeorm"

export class Src1703760687955 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const hashedPassword = await hash('admin_password', 10);

        await queryRunner.query(`
            INSERT INTO user (email, password, isAdmin)
            VALUES ('admin@example.com', '${hashedPassword}', true)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

    }

}
