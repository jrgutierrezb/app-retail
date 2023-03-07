export interface ITransaction {
    id: number;
    description: string;
    name: string;
    url: string;
    idmodule: number | null;
    namemodule?: string;
}