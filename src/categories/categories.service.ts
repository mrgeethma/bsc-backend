//this. refers to the current instance of CategoriesService class.
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
  ) {}

  private generateSlug(name: string): string { // Utility method to generate URL-friendly slugs from category names
    return name // here we generate a slug by converting the name to lowercase, replacing spaces with hyphens, and removing special characters
      .toLowerCase() 
      .replace(/[^a-z0-9\s-]/g, '') // remove invalid characters(anything that's not a-z, 0-9, space, or hyphen. The slashes / / are just wrappers that tell JavaScript: “The thing inside is a regex, not a string.” and the g at the end means "global", so it replaces all occurrences, not just the first one)
      .replace(/\s+/g, '-') // replace spaces with hyphens(one or more spaces). \s means space and + means "one or more"
      .replace(/-+/g, '-') // collapse multiple hyphens into a single hyphen 
      .trim(); // remove leading and trailing hyphens
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const slug = this.generateSlug(createCategoryDto.name); // Generate slug from category name. this.generateSlug is a method defined above and here this. refers to the current instance of CategoriesService class.
    
    // Check if slug already exists
    const existingCategory = await this.categoriesRepository.findOne({
      where: { slug },
    });

    if (existingCategory) {
      throw new ConflictException('Category with this name already exists');
    }

    const category = this.categoriesRepository.create({
      ...createCategoryDto,
      slug,
      sortOrder: createCategoryDto.sortOrder || 0,
    });

    return this.categoriesRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return this.categoriesRepository.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC', name: 'ASC' },
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

    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const newSlug = this.generateSlug(updateCategoryDto.name);
      const existingCategory = await this.categoriesRepository.findOne({
        where: { slug: newSlug },
      });

      if (existingCategory && existingCategory.id !== id) {
        throw new ConflictException('Category with this name already exists');
      }

      Object.assign(category, updateCategoryDto, { slug: newSlug });
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
