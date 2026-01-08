//this. refers to the current instance of CategoriesService class.(meke thiyena kiyana adahasa)
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) // Injecting the Category repository to interact with the database
    private categoriesRepository: Repository<Category>, // Repository for Category entity to perform database operations
  ) {} //categoriesRepository is a TypeORM repository connected to the Category entity and Used to query the database

  private generateSlug(name: string): string { // Utility method to generate URL-friendly slugs from category names
    return name // here we generate a slug by converting the name to lowercase, replacing spaces with hyphens, and removing special characters
      .toLowerCase() 
      .replace(/[^a-z0-9\s-]/g, '') // remove invalid characters(anything that's not a-z, 0-9, space, or hyphen. The slashes / / are just wrappers that tell JavaScript: “The thing inside is a regex, not a string.” and the g at the end means "global", so it replaces all occurrences, not just the first one)
      .replace(/\s+/g, '-') // replace spaces with hyphens(one or more spaces). \s means space and + means "one or more"
      .replace(/-+/g, '-') // collapse multiple hyphens into a single hyphen 
      .trim(); // remove leading and trailing spaces
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const slug = this.generateSlug(createCategoryDto.name); // Generate slug from category name. this.generateSlug is a method defined above and here this. refers to the current instance of CategoriesService class.
    
    // Check if slug already exists.
    const existingCategory = await this.categoriesRepository.findOne({ //existingCategory will be either a Category object if a matching record is found or null if no match is found
      where: { slug }, // here where: { slug } is shorthand for where: { slug: slug }. Find a category where the slug column equals the generated slug
    });

    if (existingCategory) {
      throw new ConflictException('Category with this name already exists');
    }

    const category = this.categoriesRepository.create({ // Create a new Category entity object with the provided data
      ...createCategoryDto, // *****************Spread operator to copy properties from createCategoryDto and here ...createCategoryDto means "take all properties from createCategoryDto and add them to this new object"
      slug,
      sortOrder: createCategoryDto.sortOrder || 0, // Default sortOrder to 0 if not provided and when it set to 0, it means this category will appear first in the sorted list unless other categories also have a sortOrder of 0. if multiple categories share the same sortOrder, their relative order will be determined by the secondary sorting criteria, which is name in ascending order as defined in the findAll and findAllForAdmin methods below.
    });

    return this.categoriesRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return this.categoriesRepository.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC', name: 'ASC' }, // Sort by sortOrder ascending, then by name ascending which means categories with lower sortOrder values appear first. If two categories have the same sortOrder, they are sorted alphabetically by name.
    });
  }

  async findAllForAdmin(): Promise<Category[]> {
    return this.categoriesRepository.find({
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoriesRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async findBySlug(slug: string): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { slug, isActive: true },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);

    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) { // updateCategoryDto.name eken namak enawanam saha e namai id ekata adala object eke namai samana nttn kiyala metana kiyanne. what is updateCategoryDto.name !== category.name does is it checks if the name property in the updateCategoryDto is different from the current name of the category. This ensures that we only attempt to generate a new slug and check for conflicts if the name is actually being changed.
      const newSlug = this.generateSlug(updateCategoryDto.name); // Generate new slug based on the updated name
      const existingCategory = await this.categoriesRepository.findOne({ // Check if the new slug already exists in another category
        where: { slug: newSlug }, 
      });

      if (existingCategory && existingCategory.id !== id) { // Check if the found category is different from the one being updated
        throw new ConflictException('Category with this name already exists'); // Throw conflict error if another category with the new slug exists
      }

      Object.assign(category, updateCategoryDto, { slug: newSlug }); // ***************Update category properties including the new slug and here Object.assign is used to copy the properties from updateCategoryDto to the category object and also set the slug to newSlug
    } else {
      Object.assign(category, updateCategoryDto);
    }

    return this.categoriesRepository.save(category);
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    await this.categoriesRepository.remove(category);
  }

  async softDelete(id: string): Promise<void> {
    const category = await this.findOne(id);
    category.isActive = false;
    await this.categoriesRepository.save(category);
  }

  async toggleActive(id: string): Promise<Category> {
    const category = await this.findOne(id);
    category.isActive = !category.isActive;
    return this.categoriesRepository.save(category);
  }
}
