import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {Provider, createClient, fetchExchange } from 'urql'
import {authExchange} from '@urql/exchange-auth';
import { devtoolsExchange } from '@urql/devtools';


// create urql client
const GITHUB_PERSONAL_ACCESS_TOKEN = import.meta.env.VITE_GITHUB_ACCESS_TOKEN || "";

const auth_header = `Bearer ${GITHUB_PERSONAL_ACCESS_TOKEN}`;
const client = createClient({
    url: 'https://api.github.com/graphql',
    exchanges: [
        devtoolsExchange,
        authExchange(async utils => {

            return {
                addAuthToOperation(operation) {
                    return utils.appendHeaders(operation, {
                        Authorization: auth_header,
                    });
                },
                didAuthError(error, _operation) {
                    return error.graphQLErrors.some(e => e.extensions?.code === 'FORBIDDEN');
                },
                async refreshAuth() {
                    // todo ...();
                },
            };
        }),
        fetchExchange,

    ],
})

// render root


ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider value={client}>
            <App/>
        </Provider>
    </React.StrictMode>,
)
