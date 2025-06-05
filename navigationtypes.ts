interface EducationParams {
  education: boolean;
  params?: {
    firstElement: string;
    secondElement: string;
  };
}

export type RootStackParamList = {
  StartScreen: undefined;
  LanguageScreen: undefined;
  RuleScreen: undefined;
  ConditionsScreen: undefined;
  MainlandScreen: EducationParams;
};
