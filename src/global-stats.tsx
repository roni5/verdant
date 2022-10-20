import ForgeUI, {render, Text, GlobalPage} from '@forge/ui';

const App = () => {
    return (
        <Text>Hello world</Text>
    );
};


export const run = render(
    <GlobalPage>
        <App/>
    </GlobalPage>
);