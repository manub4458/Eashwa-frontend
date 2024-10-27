import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Proxy the request to the backend Express server
      const { email, password } = req.body;
      const response = await axios.post(`${process.env.BACKEND_URL}/login`, { email, password });

      localStorage.setItem('token', response.authToken)
      console.log(response);

      // Send response back to the frontend
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ message: 'Error logging in' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
