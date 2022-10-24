import ForgeUI, {
    render,
    DashboardGadget,
    Text,
  } from "@forge/ui";
  
  const App = () => {
  
    return (
      <DashboardGadget>
        <Text>
            Hello World
        </Text>
      </DashboardGadget>
    );
  };
  
  export const run = render(<App />);