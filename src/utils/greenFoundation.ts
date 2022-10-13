import { fetch } from '@forge/api';

const greenFoundation = async (url) => {
  const urlNoProtocol = url.replace(/(^\w+:|^)\/\//, '');
  const urlNoPath = urlNoProtocol.split('/')[0];
  const response = await fetch(
    `https://admin.thegreenwebfoundation.org/api/v3/greencheck/${urlNoPath}`
  );
  const data = await response.json();
  return data;
};

export default greenFoundation;
