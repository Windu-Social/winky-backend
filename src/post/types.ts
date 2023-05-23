export type UpdateOptions = {
  $push?: {
    upVoters?: string;
    downVoters?: string;
  };
  $pull?: {
    upVoters?: string;
    downVoters?: string;
  };
};
