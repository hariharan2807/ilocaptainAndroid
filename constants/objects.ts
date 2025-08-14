export const createOrderObjBluePrint = () => {
  return Object.seal({
    address_id: 0,
    login_id: 0,
    cooking_instruction: '',
    delivery_type: '0',
    delivery_date: '',
    delivery_time: '',
    coupon_applied: 0,
    coupon_code_id: 0,
    coupon_code: '',
    coupon_type: '',
    delivery_charge: 0,
    service_type: 0,
    cgst: 0,
    sgst: 0,
    instruction: '',
    message: '',
    packing_charge: 0,
    peak_amount: 0,
    variation: [{}],
    recipe_total_amount: 0,
    tax_amount: 0,
    total_amount: 0,
    wallet_amount: 0,
    payment_amount: 0,
    actual_delivery_charges: 0,
    membership_status: 0,
    from: 1,
  });
};

export const razorPayOrderObjBlueprint = () => {
  return Object.seal({
    description: '',
    // image: 'https://thebvkbiryani.org/ControlPanel/assets/img/bvk-s-logo.png',
    currency: 'INR',
    key: '0',
    amount: 0,
    rider_id: '',
    name: 'iLo Captain',
    timeout: 1000,
    send_sms_hash: true,
    allow_rotation: true,
    notes: '',
    prefill: {
      email: '',
      contact: '',
      name: '',
    },
    theme: {
      color: '#2A2731',
      backdrop_color: '#17151C',
      hide_topbar: false,
    },
    retry: {
      enabled: true,
      max_count: 4,
    },
    config: {
      display: {
        language: 'en',
      },
    },
    modal: {
      animation: false,
      confirm_close: true,
    },
  });
};
