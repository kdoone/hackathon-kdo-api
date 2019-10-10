import { model, Document } from 'mongoose';
import { PersonSchema, BandSchema } from './schema';


interface Person extends Document {
    name: string;
    band: string;
}

interface Band extends Document {
    name: string;
}

export const Person = model<Person>('Person', PersonSchema, 'persons');
export const Band = model<Band>('Band', BandSchema, 'persons');
