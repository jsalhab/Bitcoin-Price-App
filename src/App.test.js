import App from './App';
import { shallow } from 'enzyme';
import { waitFor, render, screen, fireEvent } from '@testing-library/react';
import axios from 'axios';

test("renders App Component without error", () => {
  const wrapper = shallow(<App />);
  const appComponent = wrapper.find(`[data-test="app-component"]`);
  expect(appComponent.length).toBe(1);
});



jest.mock('react-apexcharts', () => {
  return {
    __esModule: true,
    default: () => {
      return <div />
    },
  }
})

jest.mock('apexcharts', () => ({ exec: jest.fn(() => { return new Promise((resolve) => { resolve("uri") }) }) }));

jest.mock("axios");

test("test current price API", async () => {
  axios.get.mockImplementation(() => {
    return {
      data: {
        bpi: {
          USD: {
            code: "USD",
            description: "United States Dollar",
            rate: "63,354.4783",
            rate_float: 63354.4783
          }
        }
      },
    };
  });

  render(<App />);

  await waitFor(() => {
    expect(screen.getByTestId("currency").innerHTML).toBe(
      "USD Price"
    );
    expect(screen.getByTestId("price").innerHTML).toBe(
      "63,354.4783"
    );
    const selectOne = screen.getByTestId('option-EUR');
    fireEvent.change(selectOne, {
      target: { value: "EUR" }
    });
    expect(screen.getByText("EUR")).toBeInTheDocument();
  });
});


