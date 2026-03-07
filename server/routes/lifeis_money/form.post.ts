import { eventHandler, readBody } from 'h3';

export default eventHandler(async (event) => {
  const body = await readBody(event);

  console.log("受信データ", body);
});
