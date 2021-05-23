let App = {
    web3Provider: null,
    contracts: {},
    emptyAddress: "0x0000000000000000000000000000000000000000",
    sku: 0,
    upc: 0,
    metamaskAccountID: "0x0000000000000000000000000000000000000000",
    ownerID: "0x0000000000000000000000000000000000000000",
    originFarmerID: "0x0000000000000000000000000000000000000000",
    originFarmName: null,
    originFarmInformation: null,
    originFarmLatitude: null,
    originFarmLongitude: null,
    productNotes: null,
    productPrice: 0,
    distributorID: "0x0000000000000000000000000000000000000000",
    retailerID: "0x0000000000000000000000000000000000000000",
    consumerID: "0x0000000000000000000000000000000000000000",

    init: async function () {
        App.readForm();
        /// Setup access to blockchain
        return await App.initWeb3();
    },

    readForm: function () {
        App.sku = $("#sku").val();
        App.upc = $("#upc").val();
        App.ownerID = $("#ownerID").val();
        App.originFarmerID = $("#originFarmerID").val();
        App.originFarmName = $("#originFarmName").val();
        App.originFarmInformation = $("#originFarmInformation").val();
        App.originFarmLatitude = $("#originFarmLatitude").val();
        App.originFarmLongitude = $("#originFarmLongitude").val();
        App.productNotes = $("#productNotes").val();
        App.productPrice = $("#productPrice").val();
        App.distributorID = $("#distributorID").val();
        App.retailerID = $("#retailerID").val();
        App.consumerID = $("#consumerID").val();

        console.log(
            App.sku,
            App.upc,
            App.ownerID, 
            App.originFarmerID, 
            App.originFarmName, 
            App.originFarmInformation, 
            App.originFarmLatitude, 
            App.originFarmLongitude, 
            App.productNotes, 
            App.productPrice, 
            App.distributorID, 
            App.retailerID, 
            App.consumerID
        );
    },

    initWeb3: async function () {
        /// Find or Inject Web3 Provider
        /// Modern dapp browsers...
        if (window.ethereum) {
            // use MetaMask's provider
            App.web3Provider = new Web3(window.ethereum);
            await window.ethereum.enable(); // get permission to access accounts
        } else {
            console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live",);
            // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
            App.web3Provider = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"),);
        }
        return App.initSupplyChain();
    },
    initSupplyChain: async function () {
        /// Source the truffle compiled smart contracts
        try {
            // get contract instance
            console.log(App.web3Provider);
            const networkId = await App.web3Provider.eth.net.getId();
            let OwnableArtifact = await fetch("Ownable.json").then(response => response.json());
            const deployedNetwork = OwnableArtifact.networks[networkId];
            this.contracts["SupplyChain"] = new App.web3Provider.eth.Contract(
                OwnableArtifact.abi,
                deployedNetwork.address,
            );
            console.log(this.contracts.SupplyChain);

            // get accounts
            const accounts = await App.web3Provider.eth.getAccounts();
            App.metamaskAccountID = accounts[0];
        } catch (error) {
            console.error("Could not connect to contract or chain.", error);
        }

        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', App.handleButtonClick);
    },

    handleButtonClick: async function(event) {
        event.preventDefault();

        var processId = parseInt($(event.target).data('id'));
        console.log('processId',processId);

        switch(processId) {
            case 1:
                return await App.harvestItem(event);
                break;
            case 2:
                return await App.processItem(event);
                break;
            case 3:
                return await App.packItem(event);
                break;
            case 4:
                return await App.sellItem(event);
                break;
            case 5:
                return await App.buyItem(event);
                break;
            case 6:
                return await App.shipItem(event);
                break;
            case 7:
                return await App.receiveItem(event);
                break;
            case 8:
                return await App.purchaseItem(event);
                break;
            case 9:
                return await App.fetchItemBufferOne(event);
                break;
            case 10:
                return await App.fetchItemBufferTwo(event);
                break;
            }
    },

    harvestItem: async function(event) {
        event.preventDefault();
        App.upc = $('#upc').val();
        App.originFarmerID = $('#originFarmerID').val();
        App.distributorID = $('#distributorID').val();
        App.retailerID = $('#retailerID').val();
        App.consumerID = $('#consumerID').val();
        App.originFarmName = $('#originFarmName').val();
        App.originFarmInformation = $('#originFarmInformation').val();
        App.originFarmLatitude = $('#originFarmLatitude').val();
        App.originFarmLongitude = $('#originFarmLongitude').val();
        App.productNotes = $('#productNotes').val();
        console.log('upc',App.upc);
        await App.contracts.SupplyChain.methods.addFarmer(App.originFarmerID).send({from: App.metamaskAccountID})
            .then((result) => result).catch(function(err) {console.log(err.message)});
        await App.contracts.SupplyChain.methods.addDistributor(App.distributorID).send({from: App.metamaskAccountID})
            .then((result) => result).catch(function (err) {
                console.log(err.message)
            });
        await App.contracts.SupplyChain.methods.addRetailer(App.retailerID).send({from: App.metamaskAccountID})
            .then((result) => result).catch(function (err) {
                console.log(err.message)
            });
        await App.contracts.SupplyChain.methods.addConsumer(App.consumerID).send({from: App.metamaskAccountID})
            .then((result) => result).catch(function (err) {
                console.log(err.message)
            });


        let harvestItem = await App.contracts.SupplyChain.methods.harvestItem(App.upc, App.originFarmerID, App.originFarmName, App.originFarmInformation, App.originFarmLatitude, App.originFarmLongitude, App.productNotes).send({from: App.metamaskAccountID})
            .then((result) => result).catch(function(err) {console.log(err.message)});
        $("#ftc-events").append('<li>' + JSON.stringify(harvestItem) + '</li>');
    },

    processItem: async function (event) {
        event.preventDefault();
        App.upc = $('#upc').val();
        App.originFarmerID = $('#originFarmerID').val();
        console.log(App.originFarmerID);
        console.log('upc',App.upc);
        let processItem = await App.contracts.SupplyChain.methods.processItem(App.upc).send({from: App.originFarmerID})
            .then((result) => result).catch(function(err) {console.log(err.message)});
        $("#ftc-events").append('<li>' + JSON.stringify(processItem) + '</li>');
    },
    
    packItem: async function (event) {
        event.preventDefault();
        App.upc = $('#upc').val();
        App.originFarmerID = $('#originFarmerID').val();
        console.log(App.originFarmerID);
        console.log('upc',App.upc);
        let packItem = await App.contracts.SupplyChain.methods.packItem(App.upc).send({from: App.originFarmerID})
            .then((result) => result).catch(function(err) {console.log(err.message)});
        $("#ftc-events").append('<li>' + JSON.stringify(packItem) + '</li>');
    },

    sellItem: async function (event) {
        event.preventDefault();
        App.upc = $('#upc').val();
        App.productPrice = App.web3Provider.utils.toWei($('#productPrice').val(), "wei");
        App.originFarmerID = $('#originFarmerID').val();
        console.log(App.productPrice);
        console.log('upc',App.upc);
        let sellItem = await App.contracts.SupplyChain.methods.sellItem(App.upc, App.productPrice).send({from: App.originFarmerID})
            .then((result) => result).catch(function(err) {console.log(err.message)});
        $("#ftc-events").append('<li>' + JSON.stringify(sellItem) + '</li>');
    },

    buyItem: async function (event) {
        event.preventDefault();
        App.upc = $('#upc').val();
        App.distributorID = $('#distributorID').val();
        App.productPrice = App.web3Provider.utils.toWei($('#productPrice').val(), "ether");
        console.log('upc',App.upc);
        let buyItem = await App.contracts.SupplyChain.methods.buyItem(App.upc).send({from: App.distributorID, value: App.productPrice})
            .then((result) => result).catch(function(err) {console.log(err.message)});
        $("#ftc-events").append('<li>' + JSON.stringify(buyItem) + '</li>');
    },

    shipItem: async function (event) {
        event.preventDefault();
        App.upc = $('#upc').val();
        App.distributorID = $('#distributorID').val();
        console.log('upc',App.upc);
        let shipItem = await App.contracts.SupplyChain.methods.shipItem(App.upc).send({from: App.distributorID})
            .then((result) => result).catch(function(err) {console.log(err.message)});
        $("#ftc-events").append('<li>' + JSON.stringify(shipItem) + '</li>');
    },

    receiveItem: async function (event) {
        event.preventDefault();
        App.upc = $('#upc').val();
        App.retailerID = $('#retailerID').val();
        console.log('upc',App.upc);
        let receiveItem = await App.contracts.SupplyChain.methods.receiveItem(App.upc).send({from: App.retailerID})
            .then((result) => result).catch(function(err) {console.log(err.message)});
        $("#ftc-events").append('<li>' + JSON.stringify(receiveItem) + '</li>');
    },

    purchaseItem: async function (event) {
        App.upc = $('#upc').val();
        App.consumerID = $('#consumerID').val();
        console.log('upc',App.upc);
        let purchaseItem = await App.contracts.SupplyChain.methods.purchaseItem(App.upc).send({from: App.consumerID})
            .then((result) => result).catch(function(err) {console.log(err.message)});
        $("#ftc-events").append('<li>' + JSON.stringify(purchaseItem) + '</li>');

    },

    fetchItemBufferOne: async function () {
    ///   event.preventDefault();
    ///    var processId = parseInt($(event.target).data('id'));
        App.upc = $('#upc').val();
        console.log('upc',App.upc);

        let fetchFromBufferOne = await App.contracts.SupplyChain.methods.fetchItemBufferOne(App.upc).call({from: App.metamaskAccountID})
            .then((result) => result).catch(function(err) {console.log(err.message)});
        $("#ftc-events").append('<li>' + JSON.stringify(fetchFromBufferOne) + '</li>');
    },

    fetchItemBufferTwo: async function () {
    ///    event.preventDefault();
    ///    var processId = parseInt($(event.target).data('id'));
        App.upc = $('#upc').val();
        console.log('upc',App.upc);
        let fetchFromBufferTwo = await App.contracts.SupplyChain.methods.fetchItemBufferTwo(App.upc).call({from: App.metamaskAccountID})
            .then((result) => result).catch(function(err) {console.log(err.message)});
        $("#ftc-events").append('<li>' + JSON.stringify(fetchFromBufferTwo) + '</li>');
    },

    fetchEvents: function () {
        if (typeof App.contracts.SupplyChain.currentProvider.sendAsync !== "function") {
            App.contracts.SupplyChain.currentProvider.sendAsync = function () {
                return App.contracts.SupplyChain.currentProvider.send.apply(
                App.contracts.SupplyChain.currentProvider,
                    arguments
              );
            };
        }

        App.contracts.SupplyChain.deployed().then(function(instance) {
        var events = instance.allEvents(function(err, log){
          if (!err)
            $("#ftc-events").append('<li>' + log.event + ' - ' + log.transactionHash + '</li>');
        });
        }).catch(function(err) {
          console.log(err.message);
        });
        
    }
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
