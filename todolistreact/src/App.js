import logo from './logo.svg';
import './App.css';
import TaskList from './components/taskList';

function App() {
  return (
    <div className="App">
        <h1>To do List</h1>
        <TaskList></TaskList>
    </div>
  );
}

export default App;
