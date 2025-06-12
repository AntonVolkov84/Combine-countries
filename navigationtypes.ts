interface EducationParams {
  education: boolean;
  params?: {
    firstElement: string;
    secondElement: string;
  };
}
interface ExtendedEducationParams extends EducationParams {
  mainland: string;
}

export type RootStackParamList = {
  StartScreen: undefined;
  LanguageScreen: undefined;
  RuleScreen: undefined;
  ConditionsScreen: undefined;
  MainlandScreen: EducationParams;
  TestScreen: ExtendedEducationParams;
  StudyScreen: ExtendedEducationParams;
  StarScreen: undefined;
};
