import './App.css';
import { gql, useSubscription } from '@apollo/client';

const USER_SUBSCRIPTION = gql`
  subscription OnUserChanged($userID: String!) {
    userChanged(user_id: $userID) {
      user_id
      userToRoles(filter:{target_entity_id:{is:null}}){
        role_id
        target_entity_id
      }
    }
  }
`;

function App() {
  const { data, loading } = useSubscription(
    // Change with different subsription query
    USER_SUBSCRIPTION,
    { variables: { userID: 'user_cQ6UEEEeZmPhkDv4' } },
  );

  return (
    <div>
      <h2> Apollo app 🚀</h2>
      data.userChanged is specific to subscription query - Should be replaced specific to the query
      {!loading && data?.userChanged?.userToRoles.map((ur: any) => <div>{ur.role_id} - {ur.target_entity_id}</div>)}
    </div>
  );
}

export default App;
