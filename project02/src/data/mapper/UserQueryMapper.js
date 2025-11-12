import AuthUserQuery from "../../app/queryDto/AuthUserQuery.js";
import UserQuery from "../../app/queryDto/UserQuery.js";
import UserStatsQuery from "../../app/queryDto/UserStatsQuery.js";

export default class UserQueryMapper {

    static userEntitiesToUser(query) {
        return query.length !== 0 ? query.map(row => new UserQuery(
            row['user.id'],
            row['user.name']
        )) : [];
    }

    static userEntitiesToAuthUser(query) {
        return query.length !== 0 ? query.map(row => new AuthUserQuery(
            row['user.id'],
            row['user.name'],
            row['user.password']
        )) : [];
    }

    static userEntitesToUserStats(query) {
        return query.length !== 0 ? query.map(row => new UserStatsQuery(
            row['user.id'],
            row['user.name'],
            row['stat.pollCount'], 
            row['stat.voteCount'],
        )) : [];
    }
    

}