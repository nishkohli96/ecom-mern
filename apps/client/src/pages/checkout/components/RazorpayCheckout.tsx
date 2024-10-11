import { Fragment, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material';
import {
  RazorPayOrderSuccess,
  RazorpayModalDismissReason,
} from '@ecom-mern/shared';
import AppConfig from 'constants/app-config';
import { useUpdateOrderStatusMutation } from 'redux-store';
import { loadScript } from 'utils';
import { UserLoginInfo } from 'shared';
import RouteList from 'routes/route-list';

type RazorpayProps = {
  amount: number;
  customer: UserLoginInfo;
  orderId: string;
  rzpCustomerId: string;
};

export const RazorpayCheckout = ({
  amount,
  customer,
  orderId,
  rzpCustomerId,
}: RazorpayProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  /* Load razorpay checkout modal script. */
  const displayRazorpay = async () => {
    const razorpayScriptLoaded = await loadScript(AppConfig.razorpay.scriptURL);

    if (!razorpayScriptLoaded) {
      console.log('Razorpay SDK failed to load');
      return;
    }

    const razorpayModalOptions = {
      name: 'ecom-mern',
      description: 'Order payment',
      image: 'https://i.imgur.com/3g7nmJC.png',
      key: AppConfig.razorpay.key,
      order_id: orderId,
      currency: 'INR',
      amount,
      prefill: {
        email: customer.email,
        contact: customer.phone,
        name: `${customer.name.first} ${customer.name.last}`,
      },
      customer_id: rzpCustomerId,
      remember_customer: true,
      theme: { color: theme.palette.primary.main },
      // notify: {
      //   sms: true,
      //   email: true
      // },
      options: {
        checkout: {
          method: {
            netbanking: 1,
            card: 1,
            upi: 1,
            wallet: 1,
          },
        },
      },
      handler: (response: RazorPayOrderSuccess) => {
        updateOrderStatus(response)
          .unwrap()
          .then((res) => {
            navigate(
              `${RouteList.checkout.rootPath}/${RouteList.checkout.subPaths.success}`
            );
          })
          .catch((err) => {
            console.log(err);
          });
      },
      modal: {
        confirm_close: true,
        ondismiss: async (reason: RazorpayModalDismissReason) => {
          console.log('reason: ', reason);
        },
      },
      timeout: 1000,
    };
    const razorpay = new window.Razorpay(razorpayModalOptions);

    /**
     * Test Cards
     * https://razorpay.com/docs/payments/payments/test-card-details/
     * eg: 5267 3181 8797 5449
     */
    razorpay.open();
  };

  useEffect(() => {
    displayRazorpay();
  }, []);

  return <Fragment></Fragment>;
};

/**
 * verify payment using webhook
 * https://github.com/Jasbir96/Full_stack_may_2023/blob/master/Projects_Module/code/Lecture_10_reviews/1_Payment_POC/backend/api.js
 */
