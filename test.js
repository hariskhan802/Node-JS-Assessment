async function solveChallenge() {
    const email = "ali@gmail.com";
    const baseUrl = `https://ciphersprint.pulley.com`;
  
    try {
      let currentPath = `/${email}`;
      let encryptionMethod = "nothing";
  
      while (true) {
        const response = await fetch(`${baseUrl}${currentPath}`);
        const data = await response.json();
  
        const { encrypted_path, encryption_method, expires_in, level } = data;
  
        encryptionMethod = encryption_method;
        console.log(`Level ${level}, Expires In: ${expires_in}`);
        console.log(`Encrypted Path: ${encrypted_path}`);
        console.log(`Encryption Method: ${encryptionMethod}`);
  
        if (!encrypted_path) {
          console.log("No further path found.");
          break;
        }
  
        if (encryptionMethod === "nothing") {
          currentPath = `/${encrypted_path}`;
        } else if (encryptionMethod === "encoded as base64") {
          try {
            // Decode Base64 using Buffer
            const decodedPath = decodeBase64(encrypted_path);
            currentPath = `/${decodedPath}`;
          } catch (error) {
            console.error(`Base64 Decoding Error: ${error.message}`);
            break;
          }
        } else {
          throw new Error(`Unsupported encryption method: ${encryptionMethod}`);
        }
  
        const nextChallengeResponse = await fetch(`${baseUrl}${currentPath}`);
        const nextChallengeData = await nextChallengeResponse.json();
  
        const solution = solveNextChallenge(nextChallengeData);
  
        const submitResponse = await fetch(`${baseUrl}${currentPath}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ result: solution }),
        });
  
        const submitResult = await submitResponse.json();
        console.log("Submission Result:", submitResult);
  
        if (!submitResult.encrypted_path) {
          console.log("Challenge completed!");
          break;
        }
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
  
  // Function to decode Base64 using Node.js Buffer
  function decodeBase64(base64String) {
    try {
      const paddedString = fixBase64Padding(base64String); // Ensure padding is correct
      const buffer = Buffer.from(paddedString, "base64");
      return buffer.toString("utf-8");
    } catch (err) {
      throw new Error("Invalid Base64 string");
    }
  }
  
  // Function to fix Base64 padding
  function fixBase64Padding(base64String) {
    while (base64String.length % 4 !== 0) {
      base64String += "=";
    }
    return base64String;
  }
  
  function solveNextChallenge(challengeData) {
    // Placeholder for solving next challenges
    return "default solution";
  }
  
  solveChallenge();
  