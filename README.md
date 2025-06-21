# RenovAI

This project contains a Node.js server and a small Python service used for advanced image processing.  
The Node server exposes the main REST API and serves the React client, while the Python
module handles heavy ControlNet and Stable Diffusion workflows using Replicate
and OpenAI.

## Running the services

1. **Install Node dependencies**
   ```bash
   npm install
   ```
2. **Install Python dependencies**
   ```bash
   pip install -r scripts/requirements.txt
   ```
3. **Set environment variables**
   - `OPENAI_API_KEY`
   - `REPLICATE_API_TOKEN`

4. **Start the Node server**
   ```bash
   npm run dev
   ```
   By default the server listens on port `5000`.

5. **Run the Python service**
   ```bash
   python scripts/app.py
   ```
   This launches a FastAPI app on port `8001` that mirrors the `/api/v2/*`
   endpoints from the Node backend. All generated images are saved under the
   `uploads/` folder so both servers can serve them.

With both processes running you can access the web application normally and the
Node server can delegate image generation tasks to the Python service when
needed.
