export interface TargetWeight {
  userId: string;
  recordId: string;
  timestamp: number;
  date: Date;
  targetWeight: number;
}

export interface TargetWeights {
  targetWeights: TargetWeight[];
}
