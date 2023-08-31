import { SERVICE_URL } from 'src/config/ServiceConfig';
import AccessTokenRetrievalService, {
  type AccessTokenRetrieval,
} from '../auth/AccessTokenRetrievalService';
import axios, { type AxiosRequestConfig } from 'axios';
import store, { mealPlannerActions } from 'src/store/Store';
import {
  AddRecipeError,
  DeleteRecipeError,
  EditRecipeError,
  RecipesRetrievalError,
} from './MealRecipesErrors';
import {
  buildRecipeFromResponseDto,
  buildRecipesFromResponseDto,
  mapListValuesToUIMealIngredients,
} from 'src/model/meals/MealRecipesMapping';
import { AddMealRecipeRequestDto, EditMealRecipeRequestDto } from 'src/model/meals/MealRecipeDtos';
import { UIMealIngredients, UIMealRecipe } from 'src/model/meals/UIMealsRecipes';
import { LISTS_OF_VALUES_MEAL_INGREDIENTS } from 'src/config/ListsOfValues';
import ListValuesService from '../masterdata/ListValuesService';
import { ListValuesDto } from 'src/model/masterdata/ListValuesDto';

export default class MealRecipesService {
  private static readonly instance: MealRecipesService = new MealRecipesService();

  private readonly tokenRetrievalService: AccessTokenRetrieval;
  private readonly SERVICE_URL: string | undefined;

  private constructor() {
    this.tokenRetrievalService = AccessTokenRetrievalService.getInstance();
    this.SERVICE_URL = SERVICE_URL;
  }

  public static getInstance(): MealRecipesService {
    return this.instance;
  }

  private getServiceURL(): string {
    if (this.SERVICE_URL === undefined) {
      throw Error('Missing service URL configuration!');
    }
    return `${this.SERVICE_URL}/meal/recipes`;
  }

  private buildConfigWithAuthHeader(): AxiosRequestConfig {
    return {
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.tokenRetrievalService.getAccessToken(),
      },
    };
  }

  async retrieveRecipes(): Promise<void> {
    const serviceUrl = this.getServiceURL();
    const config = this.buildConfigWithAuthHeader();

    await new Promise((_resolve, reject) => {
      axios
        .get(serviceUrl, config)
        .then((response) => {
          const recipes = buildRecipesFromResponseDto(response.data.recipes);
          store.dispatch(mealPlannerActions.setRecipes(recipes.recipes));
        })
        .catch((err) => {
          console.error('Error while retrieving recipes', err);
          if (err.response !== undefined) {
            console.error(
              'Error while retrieving recipes',
              err.response.data.errorMsg !== undefined
                ? err.response.data.errorMsg
                : err.response.data !== undefined
                ? err.response.data
                : err.response,
            );
          }

          reject(
            new RecipesRetrievalError('Error during retrieval of weight measurements!', err.stack),
          );
        });
    });
  }

  async retrieveIngredients(): Promise<void> {
    await new Promise((_resolve, reject) => {
      ListValuesService.getInstance()
        .retrieveValues(LISTS_OF_VALUES_MEAL_INGREDIENTS)
        .then((res: ListValuesDto) => {
          const ingredients: UIMealIngredients = mapListValuesToUIMealIngredients(res);
          store.dispatch(mealPlannerActions.setIngredients(ingredients.ingredients));
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    });
  }

  async addRecipe(dto: AddMealRecipeRequestDto): Promise<UIMealRecipe> {
    const serviceUrl = this.getServiceURL();
    const config = this.buildConfigWithAuthHeader();

    const requestBody = JSON.stringify(dto);

    return await new Promise((resolve, reject) => {
      axios
        .post(serviceUrl, requestBody, config)
        .then((response) => {
          const recipe = buildRecipeFromResponseDto(response.data.recipe);
          store.dispatch(mealPlannerActions.addRecipe(recipe));
          resolve(recipe);
        })
        .catch((err) => {
          console.error('Error while inserting recipe', err);
          if (err.response !== undefined) {
            console.error(
              'Error while inserting recipe',
              err.response.data.errorMsg !== undefined
                ? err.response.data.errorMsg
                : err.response.data !== undefined
                ? err.response.data
                : err.response,
            );
          }

          reject(new AddRecipeError('Error during insertion of meal recipe!', err.stack));
        });
    });
  }

  async editRecipe(dto: EditMealRecipeRequestDto): Promise<UIMealRecipe> {
    const serviceUrl = this.getServiceURL() + `/${dto.recipe.recipeId}`;
    const config = this.buildConfigWithAuthHeader();

    const requestBody = JSON.stringify(dto);

    return await new Promise((resolve, reject) => {
      axios
        .put(serviceUrl, requestBody, config)
        .then((response) => {
          const recipe = buildRecipeFromResponseDto(response.data.recipe);
          store.dispatch(mealPlannerActions.updateRecipe(recipe));
          resolve(recipe);
        })
        .catch((err) => {
          console.error('Error while editing recipe', err);
          if (err.response !== undefined) {
            console.error(
              'Error while editing recipe',
              err.response.data.errorMsg !== undefined
                ? err.response.data.errorMsg
                : err.response.data !== undefined
                ? err.response.data
                : err.response,
            );
          }

          reject(new EditRecipeError('Error during editing of meal recipe!', err.stack));
        });
    });
  }

  async deleteRecipe(recipeId: string): Promise<boolean> {
    const serviceUrl = this.getServiceURL() + `/${recipeId}`;
    const config = this.buildConfigWithAuthHeader();

    return await new Promise((resolve, reject) => {
      axios
        .delete(serviceUrl, config)
        .then(() => {
          store.dispatch(mealPlannerActions.removeRecipe(recipeId));
          resolve(true);
        })
        .catch((err) => {
          console.error('Error while deleting recipe', err);
          if (err.response !== undefined) {
            console.error(
              'Error while deleting recipe',
              err.response.data.errorMsg !== undefined
                ? err.response.data.errorMsg
                : err.response.data !== undefined
                ? err.response.data
                : err.response,
            );
          }

          reject(new DeleteRecipeError('Error during deletion of meal recipe!', err.stack));
        });
    });
  }
}
