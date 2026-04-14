import UserViewModel, { UserPolls } from "../viewmodel/UserViewModel.js";

export default class UserMapper {

    static userPollsQueryToUsersPolls(userPollsQuery) {
        return userPollsQuery.map(poll => new UserPolls(
            poll.id,
            poll.question,
            poll.options
        ));
    }

    static userQueryToUserViewModel(userQuery, userPollsQuery) {
        return new UserViewModel(
            userQuery.id,
            userQuery.name,
            UserMapper.userPollsQueryToUsersPolls(userPollsQuery),
            userQuery.pollCount,
            userQuery.voteCount
        );
    }

}