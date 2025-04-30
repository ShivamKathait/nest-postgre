import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import * as Errors from "../error-handler/error-service";
import { Update } from 'src/common/interface';
import { Listing } from './dto/listing.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private readonly productModel: Repository<Product>,
  ) { }

  async create(dto: CreateProductDto) {
    try {
      let product = await this.productModel.save(dto);
      let data = { message: "Product Created successfully.", product }
      return { data }
    } catch (error) {
      throw error
    }
  }

  async update(product_id: string, dto: UpdateProductDto) {
    try {
      let { name, description, price, } = dto;
      const is_product = await this.productModel.findOneBy({ id: +product_id });
      if (!is_product) throw new Errors.ProductNotFound();
      let update: Update = {}
      if (name) update.name = name;
      if (description) update.description = description;
      if (price) update.price = price;
      let product = await this.productModel.save({ id: is_product.id, ...update });
      let data = { message: "Product updated successfully.", product }
      return { data }
    } catch (error) {
      throw error
    }
  }

  async listing(dto: Listing) {
    try {
      const limit = +dto.limit || 10;
      const page = +dto.pagination || 1;
      const skip = (page - 1) * limit;
      const [items, total] = await this.productModel.findAndCount({
        skip,
        take: limit,
        order: { created_at: 'DESC' }, // optional: sort by created_at
      });
      return {
        data: items,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      }
    } catch (error) {
      throw error
    }
  }

  async delete(product_id: string) {
    try {
      const is_product = await this.productModel.findOneBy({ id: +product_id });
      if (!is_product) throw new Errors.ProductNotFound();
      await this.productModel.delete({ id: is_product.id });
      let data = { message: "Product removed successfully." }
      return { data }
    } catch (error) {
      throw error
    }
  }
}
