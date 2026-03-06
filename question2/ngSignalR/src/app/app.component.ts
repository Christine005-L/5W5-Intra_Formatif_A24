import { Component } from '@angular/core';
import * as signalR from "@microsoft/signalr"
import { MatButtonModule } from '@angular/material/button';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: true,
    imports: [MatButtonModule]
})
export class AppComponent {
  title = 'Pizza Hub';

  private hubConnection?: signalR.HubConnection;
  isConnected: boolean = false;

  selectedChoice: number = -1;
  nbUsers: number = 0;

  pizzaPrice: number = 0;
  money: number = 0;
  nbPizzas: number = 0;

  constructor(){
    this.connect();
  }

  connect() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5282/hubs/pizza')
      .build();

    this.hubConnection.on('UpdateNbUsers', (data) => {
      this.nbUsers = data;
    })

    this.hubConnection
        .start()
        .then(() => {
            console.log('La connexion est active!');
          })
        .catch(err => console.log('Error while starting connection: ' + err));

    // TODO: Mettre isConnected à true seulement une fois que la connection au Hub est faite
    this.isConnected = true;
  }

  selectChoice(selectedChoice:number) {
    this.selectedChoice = selectedChoice;

    this.hubConnection!.invoke('SelectChoice', selectedChoice);

    this.hubConnection!.on('UpdatePizzaPrice', (price) => {
      this.pizzaPrice = price;
    })

    this.hubConnection!.on('UpdateNbPizzaAndMoney', (money, pizzas) => {
      this.money = money;
      this.nbPizzas = pizzas;
    })
  }

  unselectChoice() {
    this.hubConnection!.invoke('UnselectChoice', this.selectedChoice);
    this.selectedChoice = -1;
  }

  addMoney() {
    this.hubConnection!.invoke('AddMoney', this.selectedChoice);

    this.hubConnection!.on('UpdateMoney', (money) => {
      this.money = money
    })
  }

  buyPizza() {
    this.hubConnection!.on('UpdateNbPizzaAndMoney', (money, pizzas) => {
      this.money = money;
      this.nbPizzas = pizzas;
    })
  }
}
