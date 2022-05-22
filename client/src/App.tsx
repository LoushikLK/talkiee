import { Provider } from "react-redux";
import { PrivateRoutes } from "routes";
import { store } from "store/store";
import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <PrivateRoutes />
    </Provider>
  );
}

export default App;
