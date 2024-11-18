const length = 20;
function generateComplexRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?/~`-='; // Mixed characters
  const space = ' ';
  let result = '';
  for (let i = 0; i < length; i++) {
    // Randomly insert a space or a character
    const useSpace = Math.random() < 0.1; // 10% chance to add a space
    if (useSpace) {
      result += space;
    } else {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  }

  return result;
}

export default { generateComplexRandomString };