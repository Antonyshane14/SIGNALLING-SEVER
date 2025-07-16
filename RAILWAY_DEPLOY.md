# 🚀 Railway Deployment Guide for VoIP Signaling Server

## Quick Deploy to Railway

### Method 1: One-Click Deploy (Recommended)
1. Go to [Railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect the repository: `Antonyshane14/SIGNALLING-SEVER`
5. Railway will automatically detect and deploy!

### Method 2: Manual Setup
1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login to Railway:
   ```bash
   railway login
   ```

3. Clone and deploy:
   ```bash
   git clone git@github.com:Antonyshane14/SIGNALLING-SEVER.git
   cd SIGNALLING-SEVER
   railway init
   railway up
   ```

## 📋 Deployment Checklist

- ✅ Repository pushed to GitHub: `Antonyshane14/SIGNALLING-SEVER`
- ✅ Railway.toml configuration file included
- ✅ Package.json with proper start script
- ✅ Environment variables configured
- ✅ Health check endpoints available
- ✅ CORS enabled for cross-origin requests
- ✅ Graceful shutdown handling

## 🔧 Environment Variables (Auto-configured by Railway)

Railway automatically sets these variables:
- `PORT` - The port your server should listen on
- `NODE_ENV` - Set to "production"
- `HOST` - Set to "0.0.0.0" for Railway compatibility

## 📡 Health Check Endpoints

Once deployed, your server will have these endpoints:
- `https://your-app.railway.app/` - Server info
- `https://your-app.railway.app/health` - Health check
- `https://your-app.railway.app/stats` - Server statistics
- `https://your-app.railway.app/test` - Connection test

## 🔗 Connect to Your Flutter App

1. Once deployed, Railway will give you a URL like: `https://your-app-name.railway.app`
2. Update your Flutter app's server configuration with this URL
3. Test the connection using the built-in server testing tools

## 🚨 Post-Deployment Testing

1. **Health Check**: Visit `https://your-app.railway.app/health`
2. **Connection Test**: Use the Flutter app's "Test Railway Server" option
3. **Socket.IO Test**: Try making calls between devices
4. **Monitor Logs**: Check Railway dashboard for any errors

## 🔄 Updating the Server

To update your deployed server:
1. Make changes to the code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update server"
   git push origin main
   ```
3. Railway will automatically redeploy!

## 🆘 Troubleshooting

### Common Issues:
1. **Deploy Failed**: Check Railway logs for Node.js version compatibility
2. **Health Check Failed**: Verify the `/health` endpoint is responding
3. **CORS Errors**: Ensure your Flutter app domain is allowed
4. **Socket.IO Issues**: Check browser console for connection errors

### Debug Commands:
```bash
# Check Railway service status
railway status

# View live logs
railway logs

# Connect to Railway shell
railway shell
```

## 📞 Support

- Railway Documentation: [docs.railway.app](https://docs.railway.app)
- Railway Discord: [railway.app/discord](https://railway.app/discord)
- GitHub Issues: Create issues in the repository for bugs

---

**Your signaling server is now ready for global deployment! 🌍**
