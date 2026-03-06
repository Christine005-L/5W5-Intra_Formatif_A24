using Microsoft.AspNetCore.SignalR;
using SignalR.Services;

namespace SignalR.Hubs
{
    public class PizzaHub : Hub
    {
        private readonly PizzaManager _pizzaManager;

        public PizzaHub(PizzaManager pizzaManager) {
            _pizzaManager = pizzaManager;
        }

        public override async Task OnConnectedAsync()
        {
            base.OnConnectedAsync();
            _pizzaManager.AddUser();
            await Clients.All.SendAsync("UpdateNbUsers", _pizzaManager.NbConnectedUsers);
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            base.OnDisconnectedAsync(exception);
            _pizzaManager.RemoveUser();
            await Clients.All.SendAsync("UpdateNbUsers", _pizzaManager.NbConnectedUsers);
        }

        public async Task SelectChoice(PizzaChoice choice)
        {
            var group = _pizzaManager.GetGroupName(choice);
            var choix = int.Parse(choice.ToString());
            await Groups.AddToGroupAsync(Context.ConnectionId, group);
            await Clients.Group(group).SendAsync("UpdatePizzaPrice", _pizzaManager.PIZZA_PRICES[choix]);
            await Clients.Group(group).SendAsync("UpdateNbPizzaAndMoney", _pizzaManager.Money[choix], _pizzaManager.NbPizzas[choix]);
        }

        public async Task UnselectChoice(PizzaChoice choice)
        {
            var group = _pizzaManager.GetGroupName(choice);
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, group);
        }

        public async Task AddMoney(PizzaChoice choice)
        {
            var group = _pizzaManager.GetGroupName(choice);
            var choix = int.Parse(choice.ToString());
            _pizzaManager.IncreaseMoney(choice);

            await Clients.Group(group).SendAsync("UpdateMoney", _pizzaManager.Money[choix]);
        }

        public async Task BuyPizza(PizzaChoice choice)
        {
            var group = _pizzaManager.GetGroupName(choice);
            var choix = int.Parse(choice.ToString());
            _pizzaManager.BuyPizza(choice);

            await Clients.Group(group).SendAsync("UpdateNbPizzaAndMoney", _pizzaManager.Money[choix], _pizzaManager.NbPizzas[choix]);
        }
    }
}
