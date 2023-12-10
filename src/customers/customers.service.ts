import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './interfaces/Customer';

@Injectable()
export class CustomersService {
  private users: Customer[] = [
    { id: 1, email: 'linh@gmail.com', name: 'Linh'},
    { id: 2, email: 'linh2@gmail.com', name: 'Linh2'},
    { id: 3, email: 'linh3@gmail.com', name: 'Linh3'},
  ];
  create(createCustomerDto: CreateCustomerDto) {
    return this.users.push(createCustomerDto);
    // return 'This action adds a new customer';
  }

  findAll() {
    return this.users;
    //return `This action returns all customers`;
  }

  findOne(id: number) {
    return this.users.find(user => user.id === id);
    // return `This action returns a #${id} customer`;
  }

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return `This action updates a #${id} customer`;
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }
}
