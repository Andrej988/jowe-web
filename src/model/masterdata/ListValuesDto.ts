export interface ListValueDto {
  value: string;
  stringSet1?: string[];
  stringSet2?: string[];
}

export interface ListValuesDto {
  values: ListValueDto[];
}
