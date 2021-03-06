$(function(){
  var $b = $('#builder');

  QUnit.module('data', {
    afterEach: function() {
      $b.queryBuilder('destroy');
    }
  });

  /**
   * Test filters values
   */
  QUnit.test('radio/checkbox/select values', function(assert) {
    $b.queryBuilder({
      filters: values_filters,
      rules: values_rules
    });

    assert.optionsMatch(
      $('#builder_rule_0 .rule-value-container input'),
      ['one', 'two', 'three'],
      'Should take an array of values'
    );

    assert.optionsMatch(
      $('#builder_rule_1 .rule-value-container input'),
      ['one', 'two', 'three'],
      'Should take an object of values'
    );

    assert.optionsMatch(
      $('#builder_rule_2 .rule-value-container option'),
      ['one', 'two', 'three'],
      'Should take an array of objects of values'
    );
  });

  /**
   * Test data validation
   */
  QUnit.test('validation', function(assert) {
    $b.queryBuilder({
      filters: validation_filters
    });

    assert.validationError($b,
      { id: 'radio' },
      /radio_empty/
    );

    assert.validationError($b,
      { id: 'checkbox' },
      /checkbox_empty/
    );

    assert.validationError($b,
      { id: 'checkbox', value: ['one', 'two'] },
      /operator_not_multiple/
    );

    assert.validationError($b,
      { id: 'select_mult' },
      /select_empty/
    );

    assert.validationError($b,
      { id: 'select_mult', value: ['one', 'two'] },
      /operator_not_multiple/
    );

    assert.validationError($b,
      { id: 'string' },
      /string_empty/
    );

    assert.validationError($b,
      { id: 'string_val', value: 'aa' },
      /string_exceed_min_length/
    );

    assert.validationError($b,
      { id: 'string_val', value: 'aaaaaa' },
      /string_exceed_max_length/
    );

    assert.validationError($b,
      { id: 'string_val', value: '12345' },
      /string_invalid_format/
    );

    assert.validationError($b,
      { id: 'integer' },
      /number_not_integer/
    );

    assert.validationError($b,
      { id: 'double' },
      /number_not_double/
    );

    assert.validationError($b,
      { id: 'integer', value: -15 },
      /number_exceed_min/
    );

    assert.validationError($b,
      { id: 'integer', value: 15 },
      /number_exceed_max/
    );

    assert.validationError($b,
      { id: 'double', value: 0.05 },
      /number_wrong_step/
    );

    assert.validationError($b,
      { id: 'date' },
      /datetime_empty/
    );

    assert.validationError($b,
      { id: 'date', value: '2014/13/15' },
      /datetime_invalid/
    );

    assert.validationError($b,
      { id: 'time', value: '07:00' },
      /datetime_exceed_min/
    );

    assert.validationError($b,
      { id: 'time', value: '18:00' },
      /datetime_exceed_max/
    );

    assert.validationError($b,
      { id: 'boolean', value: 'oui' },
      /boolean_not_valid/
    );

    assert.validationError($b,
      { id: 'custom', value: '' },
      /you_fool/
    );
  });
  
  /**
   * Test custom data
   */
  QUnit.test('custom data', function(assert) {
    assert.expect(2);
    
    $b.queryBuilder({
      filters: basic_filters
    });
    
    $b.on('afterAddRule.queryBuilder', function(e, rule) {
      assert.ok(
        JSON.stringify(rule.data) === JSON.stringify(rules_with_data.rules[0].data),
        'Custom data should be accessible in "afterAddRule" event'
      );
    });
    
    $b.queryBuilder('setRules', rules_with_data);

    assert.rulesMatch(
      $b.queryBuilder('getRules'),
      rules_with_data,
      'Should keep custom data in "getRules"'
    );
  });

  
  var rules_with_data = {
    condition: 'AND',
    data: [1,2,3],
    rules: [{
      id: 'name',
      value: 'Mistic',
      data: {
        foo: 'bar'
      }
    }]
  };

  var values_filters = [{
    id: '1',
    type: 'string',
    input: 'radio',
    values: ['one', 'two', 'three']
  }, {
    id: '2',
    type: 'string',
    input: 'checkbox',
    values: {
      one: 'One',
      two: 'Two',
      three: 'Three'
    }
  }, {
    id: '3',
    type: 'string',
    input: 'select',
    values: [
      {one: 'One'},
      {two: 'Two'},
      {three: 'Three'}
    ]
  }];

  var values_rules = {
    rules: [{
      id: '1',
      value: 'one'
    }, {
      id: '2',
      value: 'two'
    }, {
      id: '3',
      value: 'three'
    }]
  };

  var validation_filters = [{
    id: 'radio',
    input: 'radio',
    values: ['one', 'two']
  }, {
    id: 'checkbox',
    input: 'checkbox',
    values: ['one', 'two']
  }, {
    id: 'select',
    input: 'select',
    values: ['one', 'two']
  }, {
    id: 'select_mult',
    input: 'select',
    multiple: true,
    values: ['one', 'two']
  }, {
    id: 'string'
  }, {
    id: 'string_val',
    validation: {
      min: '4', max: '5',
      format: '^[a-z]?$'
    }
  }, {
    id: 'integer',
    type: 'integer',
    validation: {
      min: -10, max: 10
    }
  }, {
    id: 'double',
    type: 'double',
    validation: {
      step: 0.1
    }
  }, {
    id: 'date',
    type: 'date',
    validation: {
      format: 'YYYY/MM/DD'
    }
  }, {
    id: 'time',
    type: 'time',
    validation: {
      format: 'HH:ss',
      min: '08:00',
      max: '17:00'
    }
  }, {
    id: 'boolean',
    type: 'boolean'
  }, {
    id: 'custom',
    type: 'string',
    validation: {
      callback: function(value, rule) {
        if (value == null || !value.length) {
          return 'you_fool';
        }
      }
    }
  }];

});