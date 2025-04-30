import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { IDDto, UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { Role } from 'src/common/utils';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Listing } from './dto/listing.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  /**
 * admin will create product here
 * @param {CreateProductDto} dto  -
 * @param req -The req data from the admin's auth token 
 * @returns 
 */
  @ApiBearerAuth("authorization")
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: `Admin create Product Api` })
  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  /**
  * admin will create product here
  * @param {CreateProductDto} dto  -
  * @param req -The req data from the admin's auth token 
  * @returns 
  */
  @ApiBearerAuth("authorization")
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: `Admin update Product Api` })
  @Patch("/:id/update")
  update(@Param() ID: IDDto, @Body() dto: UpdateProductDto) {
    return this.productService.update(ID.id, dto);
  }


  /**
    * Here super user or owner can see all the components
    * @param {Listing} dto - component data to save
    * @returns 
    */
  @ApiBearerAuth("authorization")
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiConsumes('application/json', 'application/x-www-form-urlencoded')
  @ApiOperation({ summary: `Component listing Api` })
  @Get('listing')
  async component_list(@Query() dto: Listing) {
    return this.productService.listing(dto);
  }


   /**
  * admin will create product here
  * @param {CreateProductDto} dto  -
  * @param req -The req data from the admin's auth token 
  * @returns 
  */
   @ApiBearerAuth("authorization")
   @Roles(Role.ADMIN)
   @UseGuards(JwtAuthGuard, RolesGuard)
   @ApiOperation({ summary: `Admin delete Product Api` })
   @Delete("/:id")
   delete(@Param() ID: IDDto) {
     return this.productService.delete(ID.id);
   }
}
