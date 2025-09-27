export async function run(message, params) {
  // your logic here
  console.log("Echo tool called with:", { message, params });
  return { message, params };
}