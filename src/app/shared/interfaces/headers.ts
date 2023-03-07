export interface IHeaders {
    columnName: string;   //Titulo de la columna
    field:   string;   //identificador de columna
    type: 'number' | 'boolean' | 'string' | 'date' | 'datetime' | 'lookup' | 'file';
    validate?: 'required';
    isModify?: boolean;
    format?: 'money';
}