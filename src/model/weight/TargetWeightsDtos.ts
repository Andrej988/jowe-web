export interface AddTargetWeightRequestDto {
  targetWeight: number;
}

export interface TargetWeightResponseDto {
  userId: string;
  recordId: string;
  timestamp: number;
  targetWeight: number;
  lastModified?: number;
}

export interface TargetWeightsResponseDto {
  targets: TargetWeightResponseDto[];
}
