const axios = require("axios");

const url = "http://localhost:3000/createPost";
const NumIterations = 5000;

const createPost = async (index) => {
  const postData = {
    title: `Random Post Test(${index})`,
    content: `Post (${index})`,
  };

  try {
    const response = await axios.post(url, postData);
    console.log(`Post ${index}:`, response.data);
  } catch (error) {
    console.error(
      `Error posting ${index}:`,
      error.response ? error.response.data : error.message
    );
  }
};

const runTests = async () => {
  for (let i = 1; i <= NumIterations; i++) {
    await createPost(i);
  }
};

runTests();
