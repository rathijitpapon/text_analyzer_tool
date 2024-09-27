import { Postgres } from '../../providers/postgres';

// Text Interface
export interface Text {
    id: string;
    text: string;
    wordCount: number;
    characterCount: number;
    sentenceCount: number;
    paragraphCount: number;
    longestParagraphWords: string[];
    createdAt: Date;
    updatedAt: Date;
};

// Creatable Text Interface
export type CreatableText = Pick<Text, 'text' | 'wordCount' | 'characterCount' | 'sentenceCount' | 'paragraphCount' | 'longestParagraphWords'>;

// Updatable Text Interface
export type UpdatableText = CreatableText;

// Viewable Text Type
export type ViewableText = Pick<Text, 'id' | 'text' | 'wordCount' | 'characterCount' | 'sentenceCount' | 'paragraphCount' | 'longestParagraphWords'>;

// Primary Key
export const PrimaryKey = ['id'];

// Unique Keys
export const UniqueKeys = [];

// Foreign Keys
export const ForeignKeys = [];

// Indexes
export const Indexes = [];

// Relationships
export const Relationships = [];

// Table Creation Function
export const createTextTable = async (): Promise<void> => {
    const postgres = await Postgres.getInstance();

    // check if the table exists
    const tableExists = await postgres.query("SELECT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'texts');");
    if (tableExists.rows[0].exists) {
        return;
    }

    // Define the columns for the Text table
    const textColumns: Record<string, string> = {
        id: 'UUID PRIMARY KEY DEFAULT uuid_generate_v1mc()',
        text: 'TEXT NOT NULL',
        wordCount: 'INTEGER NOT NULL',
        characterCount: 'INTEGER NOT NULL',
        sentenceCount: 'INTEGER NOT NULL',
        paragraphCount: 'INTEGER NOT NULL',
        longestParagraphWords: 'TEXT[]',
        createdAt: 'TIMESTAMPTZ NOT NULL DEFAULT NOW()',
        updatedAt: 'TIMESTAMPTZ NOT NULL DEFAULT NOW()'
    };

    // Create the Text table
    await postgres.createTable('texts', textColumns);
    await postgres.query("SELECT trigger_updated_at('texts');");
}