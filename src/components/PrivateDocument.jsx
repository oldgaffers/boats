import { useState, useEffect, ReactNode } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import RoleRestricted from "./rolerestrictedcomponent";
import LoginButton from './loginbutton';

import { toJsxRuntime } from 'hast-util-to-jsx-runtime';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
import { toHast } from '@googleworkspace/google-docs-hast';

const apiWeb = 'https://5li1jytxma.execute-api.eu-west-1.amazonaws.com/default/doc';

export async function getApiWeb(doc, accessToken) {
  return (await fetch(
    `${apiWeb}?doc_name=${doc}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/javascript',
        Authorization: `Bearer ${accessToken}`,
      }
    }
  )).json();
}

function RenderToElement({ doc }) {
  if (!doc) return null;
  const tree = toHast(doc);
  return toJsxRuntime(tree, { Fragment, jsx, jsxs });
}

export default function PrivateDocument({ name }) {
  const [doc, setDoc] = useState();
  const { getAccessTokenSilently } = useAuth0();
  const [token, setToken] = useState();

  useEffect(() => {
    async function getToken() {
      if (!token) {
        const tok = await getAccessTokenSilently();
        setToken(tok);
      }
    }
    getToken();
  }, [token]);

  useEffect(() => {
    const getData = async () => {
      if (name && token) {
        setDoc(await getApiWeb(name, token))
      }
    }
    if (!doc) {
      getData();
    }
  }, [doc, name, token]);

  return (
    <>
      <RoleRestricted role="member">
      <RenderToElement doc={doc} />
      </RoleRestricted>
      <LoginButton />
    </>
  );
}
