import { RelatedModelInputObjectTypeGenerator, RelatedGeneratorArgs, IGenerators, TypeFromModelGenerator } from '../../generator'
import { IGQLType, IGQLField } from '../../../datamodel/model'
import { GraphQLObjectType, GraphQLFieldConfigMap, GraphQLFieldConfig, GraphQLList, GrqphQLNonNull, GraphQLInputObjectType, GraphQLString } from "graphql/type"


export default class ModelUpdateInputGenerator extends RelatedModelInputObjectTypeGenerator {
  public static generateScalarFieldTypeForInputType(model: IGQLType, field: IGQLField, generators: IGenerators) {
    if (TypeFromModelGenerator.reservedFields.includes(field.name)) {
      return null
    }

    if (field.isList) {
      return generators.scalarListUpdateInput.generate(model, field)
    } else {
      return generators.scalarTypeGenerator.mapToScalarFieldTypeForceOptional(field)
    }
  }
  /**
   * Generates an generator for a relational type, handling the four cases many/one and with/without related type. 
   * @param model 
   * @param field 
   * @param generators 
   */
  public static getGeneratorForRelationField(field: IGQLField, generators: IGenerators) : RelatedModelInputObjectTypeGenerator {
    if (field.relatedField !== null) {
      if (field.isList) {
        return generators.modelUpdateManyWithoutRelatedInput
      } else {
        return generators.modelUpdateOneWithoutRelatedInput
      }
    } else {
      if (field.isList) {
        return generators.modelUpdateManyInput
      } else {
        return generators.modelUpdateOneInput
      }
    }
  }

  public static generateRelationFieldForInputType(model: IGQLType, field: IGQLField, generators: IGenerators) {
    const relationInfo = { relatedField: field, relatedType: model, relationName: field.relationName }
    const generator = ModelUpdateInputGenerator.getGeneratorForRelationField(field, generators)

    if(generator.wouldBeEmpty(field.type as IGQLType, relationInfo)) {
      return null
    } else {
      return generator.generate(field.type as IGQLType, relationInfo)
    }
  }

  
  public getTypeName(input: IGQLType, args: RelatedGeneratorArgs) {
    return `${input.name}UpdateInput`
  }
  
  protected wouldBeEmptyInternal(model: IGQLType, args: RelatedGeneratorArgs) {
    return !TypeFromModelGenerator.hasScalarFieldsExcept(model.fields, ...TypeFromModelGenerator.reservedFields) &&
            model.fields.filter(field => typeof(field.type) === 'object').every(field => {
              const generator = ModelUpdateInputGenerator.getGeneratorForRelationField(field, this.generators)
              return generator.wouldBeEmpty(field.type as IGQLType, { relatedField: field, relatedType: model, relationName: field.relationName })
            })
  }

  protected generateScalarFieldType(model: IGQLType, args: RelatedGeneratorArgs, field: IGQLField) {
    return ModelUpdateInputGenerator.generateScalarFieldTypeForInputType(model, field, this.generators)
  }

  protected generateRelationFieldType(model: IGQLType, args: RelatedGeneratorArgs, field: IGQLField) {
    return ModelUpdateInputGenerator.generateRelationFieldForInputType(model, field, this.generators)
  }
}