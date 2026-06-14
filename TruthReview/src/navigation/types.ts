import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Landing: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  PGDetails: { pgId: string };
  PGReviews: { pgId: string };
  AddReview: { pgId: string; reviewId?: string };
  AddProperty: undefined;
  VerifyResidency: { pgId: string };
  ClaimProperty: { pgId: string };
};

export type SearchStackParamList = {
  Search: undefined;
  Filters: {
    filters?: {
      verifiedOnly?: boolean;
      ac?: boolean;
      wifi?: boolean;
      foodIncluded?: boolean;
      maleHostel?: boolean;
      femaleHostel?: boolean;
      highTrustScore?: boolean;
      budgetRange?: string | null;
      propertyType?: string | null;
    };
  } | undefined;
  PGDetails: { pgId: string };
};

export type FavoritesStackParamList = {
  Favorites: undefined;
  PGDetails: { pgId: string };
};

export type ProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  MyReviews: undefined;
  AdminPanel: undefined;
  ManagePGs: undefined;
  ManageReviews: undefined;
  ManageUsers: undefined;
  ManageVerifications: undefined;
  ManageReports: undefined;
  OwnerPanel: undefined;
  AddProperty: undefined;
};

export type MainTabParamList = {
  HomeStack: NavigatorScreenParams<HomeStackParamList>;
  SearchStack: NavigatorScreenParams<SearchStackParamList>;
  AddReviewTab: undefined;
  FavoritesStack: NavigatorScreenParams<FavoritesStackParamList>;
  ProfileStack: NavigatorScreenParams<ProfileStackParamList>;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};
