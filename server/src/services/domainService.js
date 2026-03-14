import axios from 'axios';

export async function checkCompanyDomain(companyName) {
  if (!companyName || companyName === 'Unknown') {
    return { checked: false, reason: 'No company name found' };
  }

  // Guess the domain (simple heuristic)
  const guessedDomain = companyName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 20) + '.com';

  try {
    const response = await axios.get(`https://${guessedDomain}`, {
      timeout: 5000,
      validateStatus: (status) => status < 500
    });

    return {
      checked: true,
      domainGuess: guessedDomain,
      exists: true,
      statusCode: response.status
    };
  } catch (err) {
    return {
      checked: true,
      domainGuess: guessedDomain,
      exists: false,
      reason: 'Domain does not respond'
    };
  }
}