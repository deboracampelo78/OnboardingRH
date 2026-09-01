import { Schema, model, Document, Types } from 'mongoose';

export interface OnboardingItem {
  _id: Types.ObjectId;
  titulo: string;
  concluida: boolean;
}

export interface OnboardingEtapa {
  _id: Types.ObjectId;
  titulo: string;
  periodo: string;
  itens: Types.DocumentArray<OnboardingItem>;
}

export interface OnboardingProcessDocument extends Document {
  colaboradorNome: string;
  colaboradorEmail: string;
  cargo: string;
  departamento: string;
  dataAdmissao: Date;
  etapas: Types.DocumentArray<OnboardingEtapa>;
  createdAt: Date;
  updatedAt: Date;
}

const onboardingItemSchema = new Schema<OnboardingItem>({
  titulo: { type: String, required: true },
  concluida: { type: Boolean, default: false },
});

const onboardingEtapaSchema = new Schema<OnboardingEtapa>({
  titulo: { type: String, required: true },
  periodo: { type: String, required: true },
  itens: { type: [onboardingItemSchema], default: [] },
});

const onboardingProcessSchema = new Schema<OnboardingProcessDocument>(
  {
    colaboradorNome: { type: String, required: true },
    colaboradorEmail: { type: String, required: true },
    cargo: { type: String, required: true },
    departamento: { type: String, required: true },
    dataAdmissao: { type: Date, required: true },
    etapas: { type: [onboardingEtapaSchema], default: [] },
  },
  { timestamps: true }
);

export const OnboardingProcess = model<OnboardingProcessDocument>(
  'OnboardingProcess',
  onboardingProcessSchema
);
