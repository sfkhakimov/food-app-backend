import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { EditRecipeDto } from 'modules/recipe/dto/EditRecipe.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { RecipeEntity } from 'modules/recipe/recipe.entity'
import { Repository } from 'typeorm'
import { UserEntity } from 'modules/user/user.entity'

@Injectable()
export class RecipeServices {
    constructor(
        @InjectRepository(RecipeEntity)
        private readonly recipeRepository: Repository<RecipeEntity>,
    ) {}
    async createRecipe(
        user: UserEntity,
        editRecipeDto: EditRecipeDto,
    ): Promise<RecipeEntity> {
        const recipe = new RecipeEntity()

        Object.assign(recipe, editRecipeDto)

        recipe.author = user

        return await this.recipeRepository.save(recipe)
    }

    async deleteRecipe(id: number): Promise<RecipeEntity> {
        const recipe = await this.findById(id)

        await this.recipeRepository.delete({ id })

        return recipe
    }

    async updateRecipe(
        id: number,
        editRecipeDto: EditRecipeDto,
    ): Promise<RecipeEntity> {
        const recipe = await this.findById(id)

        Object.assign(recipe, editRecipeDto)

        return await this.recipeRepository.save(recipe)
    }

    async findById(id: number): Promise<RecipeEntity> {
        const recipe = await this.recipeRepository.findOne(id, {
            relations: ['author'],
        })

        if (!recipe) {
            throw new HttpException('Рецепт не найден', HttpStatus.BAD_REQUEST)
        }

        return recipe
    }
}