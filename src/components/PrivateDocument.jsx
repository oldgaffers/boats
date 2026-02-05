import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import RoleRestricted from "./rolerestrictedcomponent";

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
  const { getAccessTokenSilently, logout } = useAuth0();

  useEffect(() => {
      if (name && !doc) {
        getAccessTokenSilently().then(async (accessToken) => {
            const d = await getApiWeb(name, accessToken);
            setDoc(d);
        }).catch((e) => {
          console.error('Error getting access token:', e);
          const returnTo = window.location.origin + window.location.pathname;
          logout({ returnTo });
          alert('Error getting access token, please log in again');
        }); 
      }
  }, [doc, name]);

  return (
    <>
      <RoleRestricted role="member">
      <RenderToElement doc={doc} />
      </RoleRestricted>
    </>
  );
}
