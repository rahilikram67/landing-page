const FIGMA_TOKEN = "figd_kNvU7BbzHYLX4kC1WjV-VwT8SON1AftXyLuaExwK";
const FILE_KEY = "IbpRR7joICdAQEgxUKz3wL";
const NODE_IDS = [
  '21603-102882', // 5
  '21603-107482', // 6-1
  '21604-113452', // 6-2
  '21604-118445', // 7-1
  '21604-120099', // 7-2
  '21604-120968', // 7-3
  '21604-124036', // 7-4
  '21604-125513', // 8-1
  '21604-125551', // 8-2
];

async function getFigmaNodes() {
    
  // call each node id one by one and write at location ./figma-json/desktop/frame[index+4].json
  for (let i = 0; i < NODE_IDS.length; i++) {
    const url = `https://api.figma.com/v1/files/${FILE_KEY}/nodes?ids=${NODE_IDS[i]}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-Figma-Token": FIGMA_TOKEN,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    await Bun.write(`./figma-json/desktop/frame${i+4}.json`, JSON.stringify(data, null, 2));
  }
  return;

}

getFigmaNodes();