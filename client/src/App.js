import logo from "./logo.svg";
import { gql, useQuery } from "@apollo/client";


//aa rite apde query lakhi saksu ane ema GetTodosWithUser che te game te name che je aapi sakay ane ema getTodos ek query che je aapde backend ma lakhi che e 
const query = gql`
  query GetTodosWithUser {
    getTodos {
      id
      title
      completed
      user {
        id
        name
      }
    }
  }
`;

function App() {
  //useQuery ni madad thi aapde e query ne run kari saksu ane ane e Query aapn ne data return karse ane ek loading return karse e loading ma true ka false hase jya sudhi data aave na tya sudhi loading ni value false hase 
  const { data, loading } = useQuery(query);

  if (loading) return <h1>Loading...</h1>;

  return (
    <div className="App">
      <table>
        <tbody>
          {data.getTodos.map((todo) => (
            <tr key={todo.id}>
              <td>{todo.title}</td>
              <td>{todo?.user?.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
