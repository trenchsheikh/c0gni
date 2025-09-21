# 🎯 Polymarket Real Trading Setup

This documentation explains how to set up **REAL** Polymarket trading with actual funds using the integrated py-clob-client.

## ⚠️ **IMPORTANT WARNINGS**

- **This uses REAL money** - you can lose actual USDC
- **Keep private keys secure** - never commit them to git
- **Start with small amounts** to test the system
- **Only trade what you can afford to lose**

## 🔧 Setup Requirements

### 1. Install Python Dependencies

```bash
cd agents
python3 -m venv venv
source venv/bin/activate
pip install py-clob-client web3 eth-account
```

### 2. Environment Configuration

Create `.env.local` with your trading configuration:

```bash
# Your wallet private key (0x prefixed)
USER_PRIVATE_KEY=0x1234567890abcdef...

# Set to true for testnet (recommended for testing)
POLYMARKET_TESTNET=false

# Polygon RPC URL for balance checking
POLYGON_RPC_URL=https://polygon-rpc.com
```

### 3. Wallet Setup

1. **Use Polygon Network**: Polymarket runs on Polygon
2. **Have USDC**: You need USDC on Polygon for trading
3. **Gas Fees**: Keep some MATIC for transaction fees

## 🚀 Trading Features

### Real Market Data
- ✅ Live market prices from Polymarket APIs
- ✅ Real token IDs for YES/NO outcomes
- ✅ Current order book data
- ✅ Real-time balance checking

### Production Trading
- ✅ Actual order placement via py-clob-client
- ✅ Real transaction signatures
- ✅ Polygon blockchain integration
- ✅ USDC balance validation
- ✅ Order status tracking

### Safety Features
- ✅ Balance verification before trades
- ✅ Network validation (Polygon required)
- ✅ Private key security warnings
- ✅ Transaction error handling
- ✅ Real-time order status

## 📖 How It Works

### 1. Market Data Flow
```
Polymarket APIs → Next.js API Routes → Frontend Display
├── Gamma API (market discovery)
├── CLOB API (trading data)
└── Token IDs extracted for trading
```

### 2. Trading Flow
```
User Order → Frontend Validation → Python Service → Polymarket CLOB → Blockchain
├── Balance check via Web3
├── Order signing with private key
├── py-clob-client execution
└── Transaction confirmation
```

### 3. Architecture
```
Frontend (React/Next.js)
├── Trading Modal (user interface)
├── Balance Display (real USDC)
├── Order Validation
└── Network Checking

Backend (Next.js API + Python)
├── /api/markets/polymarket/trade (order placement)
├── /api/markets/polymarket/balance (USDC balance)
├── /api/markets/polymarket/positions (real positions)
└── Python Service (py-clob-client integration)
```

## 🔐 Security Best Practices

### Private Key Management
- **Never commit private keys to git**
- **Use environment variables only**
- **Consider hardware wallet integration for production**
- **Rotate keys regularly**

### Trading Safety
- **Start with testnet**: Set `POLYMARKET_TESTNET=true`
- **Use small amounts first**
- **Monitor your trades carefully**
- **Keep backups of important data**

## 🧪 Testing Process

### 1. Testnet Testing
```bash
# Set in .env.local
POLYMARKET_TESTNET=true
```

### 2. Mainnet Testing (Small Amounts)
```bash
# Set in .env.local
POLYMARKET_TESTNET=false
USER_PRIVATE_KEY=0x... # Your real private key
```

### 3. Production Trading
- Verify all balances and positions
- Monitor transaction status
- Keep transaction records

## 🐛 Troubleshooting

### Common Issues

**Python Dependencies**
```bash
# If py-clob-client fails to install
cd agents
source venv/bin/activate
pip install --upgrade pip
pip install py-clob-client web3 eth-account
```

**Balance Loading Fails**
- Check Polygon RPC URL
- Verify wallet address format
- Ensure USDC contract access

**Order Placement Fails**
- Verify sufficient USDC balance
- Check network is Polygon
- Confirm market is active for trading
- Validate private key format

**Token ID Missing**
- Some markets may not have token IDs yet
- Trading disabled for these markets
- Try different markets with complete data

## 📊 Monitoring Your Trading

### Real-Time Data
- **Portfolio Tab**: View current positions and P&L
- **Orders Tab**: Track order status and history
- **Balance Display**: Real-time USDC balance

### Transaction Records
- All trades saved to database
- Transaction hashes for blockchain verification
- Complete audit trail

## 🔄 Upgrading from Demo

If upgrading from the demo version:

1. **Install Python dependencies** (see above)
2. **Set environment variables** with real keys
3. **Test on testnet first**
4. **Start with small amounts**

## 📞 Support

For issues with:
- **py-clob-client**: Check [official documentation](https://github.com/Polymarket/py-clob-client)
- **Polygon network**: Verify RPC endpoints
- **USDC transfers**: Check Polygon block explorer

---

**Remember: This is real money trading. Use at your own risk and only trade what you can afford to lose.**