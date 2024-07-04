import React from 'react';

interface AppProps {
    icon: string; // Unicode string for the emoji
    name: string;
}

const App: React.FC<AppProps> = ({ icon, name }) => {
    return (
        <div>
            <p>
                {icon} {name}
            </p>
        </div>
    );
};

export default App;
